set velocity = nasa_measures

set filter = smooth4k

set model_dem_par =  larsenc_250.dem_par

set thickness = bedmap2_thickness.geo	# bedmap2 data reprojected to larsenc_250.dem_par
set surface = bedmap2_surface.geo

set pixels = `awk '{if($1 == "width:") printf("%d\n", $2)}' < $model_dem_par`
set lines = `awk '{if($1 == "nlines:") printf("%d\n", $2)}' < $model_dem_par`

set epost = `awk '{if($1 == "post_east:")  printf("%d\n", $2)}' < $model_dem_par`
set npost = `awk '{if($1 == "post_north:") printf("%d\n", $2)}' < $model_dem_par`
set npost_pos = `awk '{if($1 == "post_north:") printf("%d\n", -$2)}' < $model_dem_par`
set tl_easting = `awk '{if($1 == "corner_east:") printf("%d\n", $2)}' < $model_dem_par`
set tl_northing = `awk '{if($1 == "corner_north:") printf("%d\n", $2)}' < $model_dem_par`
set secant_lat = `awk '{if($1 == "PS_secant_lat:") printf("%d\n", $2)}'	 < $model_dem_par`
set central_lon = 0

set br_northing = `echo $tl_northing $npost $lines | awk '{printf("%d\n", $1 + $2*$3)}'`
set br_easting = `echo $tl_easting $epost $pixels | awk '{printf("%d\n", $1 + $2*$3)}'`
set bl_northing = $br_northing
set tr_easting  = $br_easting
set tr_northing = $tl_northing
set bl_easting  = $tl_easting
echo tl_northing = $tl_northing : tl_easting = $tl_easting
echo br_northing = $br_northing : br_easting = $br_easting
echo pixels = $pixels : lines = $lines

set inlet = CI
# set inlet = whirlwind

# using borehole densities
# these are depth-mean densities from the borehole data
if($inlet == "CI") then
	set density_in = lcis_density_summary_CI_120.mean.txt
endif
if($inlet == "whirlwind") then
	set density_in = lcis_density_summary_WI_70.mean.txt
endif

# ie do adjust accumulated layers for borehole density
set density_adjust = 1

# density of accumulated snow
set new_acc_density = 400


if($inlet == "CI") then
	set start = Cabinet_Inlet_forward_flowline.ps.txt
endif
if($inlet == "whirlwind") then
	set start = Whirlwind_Inlet_forward_flowline.ps.txt
endif

foreach field (25pc med 75pc)

if($field == "med") set scale = v100
if($field == "25pc") set scale = v110
if($field == "75pc") set scale = v90

# downflow start points in metres (point 0 is just max upstream position of the flowline. ie not necessarily the grounding line
# use as many as required
if($inlet == "CI") then
  if($field == "med") then
      set z1_start = 7000	
      set z2_start = 43000	
      set z3_start = 79000	
      set z4_start = 48500	
      set z5_start = 12500 	
      set z6_start = 1600 	
      set z7_start = 1600	
      set z8_start = 1600	
      
   endif
  if($field == "25pc") then
      set z1_start = 3400	
      set z2_start = 40500	
      set z3_start = 48000	
      set z4_start = 48000
      set z5_start = 3000  
      set z6_start = 700
      set z7_start = 700 
      set z8_start = 700 	#40000 # base CI_120, 90 m
    
   endif
  if($field == "75pc") then
      set z1_start = 14300	 
      set z2_start = 45000	
      set z3_start = 94500	
      set z4_start = 49500
      set z5_start = 22900
      set z6_start = 6000 	
      set z7_start = 6000 	
      set z8_start = 6000 

   endif
   
   
   
endif

if($inlet == "whirlwind") then
 if($field == "med") then
      set z1_start = 14000	
      set z2_start = 33000 
      set z3_start = 33000 
      set z4_start = 33000 
      set z5_start = 33000 
      set z6_start = 33000 
      set z7_start = 33000 
      set z8_start = 33000 
     
 endif
 if($field == "25pc") then
      set z1_start = 10500	
      set z2_start = 14000 	
      set z3_start = 14000 	
      set z4_start = 14000 
      set z5_start = 14000 
      set z6_start = 14000 
      set z7_start = 14000 
      set z8_start = 14000 
      
    endif
if($field == "75pc") then
      set z1_start = 17200	
      set z2_start = 46000  	
      set z3_start = 46000 	
      set z4_start = 46000  
      set z5_start = 46000 
      set z6_start = 46000 
      set z7_start = 46000 
      set z8_start = 46000 
      
    endif

  endif
	
	set smb = smb_yearly_PEN055_ERAIN_r507_1979_2014_cum.ps.1979-2014.$field 

# extract parameters along the flowline 

	if(1) then
		gmt grdtrack $start -G$velocity.$scale.$filter.mag.grd > velocity_mag.$start:r:r:t
		gmt grdtrack velocity_mag.$start:r:r:t -G$smb.grd > velocity_mag.smb.$start:r:r:t
		rm -f velocity_mag.$start:r:r:t
		gmt grdtrack velocity_mag.smb.$start:r:r:t -G$velocity.$scale.v2.$filter.zz.grd > velocity_mag.smb.vstrain.$start:r:r:t
		rm -f velocity_mag.smb.$start:r:r:t
		gmt grdtrack velocity_mag.smb.vstrain.$start:r:r:t -G$thickness.grd > velocity_mag.smb.vstrain.thick.$start:r:r:t
		rm -f velocity_mag.smb.vstrain.$start:r:r:t
		gmt grdtrack velocity_mag.smb.vstrain.thick.$start:r:r:t -G$surface.grd > velocity_mag.smb.vstrain.thick.sfc.$start:r:r:t
		rm -f velocity_mag.smb.vstrain.thick.$start:r:r:t
	endif
	
	# may need to remove last few lines of $flow_dir/results_v5/velocity_mag.smb.vstrain.thick.sfc.$start where thickness and/or surface elevation run out.
	awk '{if(($7 != 0) && ($6 != "NaN")) print $0}' < velocity_mag.smb.vstrain.thick.sfc.$start:r:r:t > track.tmp
	mv -f track.tmp velocity_mag.smb.vstrain.thick.sfc.$start:r:r:t
	
#$1 = easting (m)
#$2 = northing (m)
#$3 = segment length (fraction of a pixel)
#$4 = along flow velocity (m/yr)
#$5 = smb rate (mm/yr)
#$6 = vstrain rate (/yr)
#$7 = thickness (m)
#$8 = elev (m)

	set flow_in = velocity_mag.smb.vstrain.thick.sfc.$start:r:r:t
	
# R to accumulate along the flowline

			echo 'flow_table<-read.table("'$flow_in'")' > flow_acc.R

			echo 'dens_prof<-read.table("'$density_in'")' >> flow_acc.R
			
			# name the columns and smb is converted to m/yr
			echo 'flow_frame<-data.frame(east=flow_table[,c(1)],north=flow_table[,c(2)],seg_length=flow_table[,c(3)],vel=flow_table[,c(4)],smb_rate=flow_table[,c(5)]/1000,vstrain_rate=flow_table[,c(6)],thick=flow_table[,c(7)],elev=flow_table[,c(8)])' >> flow_acc.R
			
			echo 'dens_prof<-read.table("'$density_in'")' >> flow_acc.R

			# calculate time spent in each cell
			set stream = 1	# for forward flowline
			echo 'flow_frame$time <- '$stream'*'$epost'*flow_frame$seg_length/flow_frame$vel' >> flow_acc.R
			
			# calculate smb per cell time
			echo 'flow_frame$smb <- flow_frame$time*flow_frame$smb_rate' >> flow_acc.R
			
			# accumulate distance, time, smb and layer Z along the flowline according to z2 = z1 exp(vstrain del T) + smb_rate/vstrain (exp(hstrain del T) - 1)
			
			echo 'flow_frame[1,"acc_time"] <- flow_frame[1,"time"]' >> flow_acc.R
			echo 'for(i in 2:length(flow_frame$time)){' >> flow_acc.R
				echo 'flow_frame[i,"acc_time"] <- flow_frame[i,"time"] + flow_frame[i-1,"acc_time"]' >> flow_acc.R
			echo '}' >> flow_acc.R
			
			echo 'flow_frame[1,"dist"] <- '$epost'*flow_frame[1,"seg_length"]' >> flow_acc.R
			echo 'for(i in 2:length(flow_frame$time)){' >> flow_acc.R
				echo 'flow_frame[i,"dist"] <- '$epost'*flow_frame[i,"seg_length"] + flow_frame[i-1,"dist"]' >> flow_acc.R
			echo '}' >> flow_acc.R
			
			
			echo 'flow_frame[1,"tot_smb"] <- flow_frame[1,"smb"]' >> flow_acc.R
			echo 'for(i in 2:length(flow_frame$time)){' >> flow_acc.R
				echo 'flow_frame[i,"tot_smb"] <- flow_frame[i,"smb"] + flow_frame[i-1,"tot_smb"]' >> flow_acc.R
			echo '}' >> flow_acc.R
			
			# Initialize as many layers as needed (these trace the facies interfaces or core bases)
			echo 'last_ice_z2_density = vector()' >> flow_acc.R
			echo 'for(layer in 1:8){' >> flow_acc.R
			    echo 'last_ice_z2_density[layer]<-0' >> flow_acc.R
			    echo 'for(i in 1:(length(flow_frame$time)-1)){' >> flow_acc.R
				echo 'flow_frame[i,13+layer] <- 0' >> flow_acc.R	# thickness of first ice layer
			    echo '}' >> flow_acc.R
			echo '}' >> flow_acc.R
			
			# layer start points, different for each trajectory
			echo 'start = vector()' >> flow_acc.R
			echo 'start[1] <- '$z1_start'' >> flow_acc.R
			echo 'start[2] <- '$z2_start'' >> flow_acc.R
			echo 'start[3] <- '$z3_start'' >> flow_acc.R
			echo 'start[4] <- '$z4_start'' >> flow_acc.R
			echo 'start[5] <- '$z5_start'' >> flow_acc.R
			echo 'start[6] <- '$z6_start'' >> flow_acc.R
			echo 'start[7] <- '$z7_start'' >> flow_acc.R
			echo 'start[8] <- '$z8_start'' >> flow_acc.R
			
			echo 'start' >> flow_acc.R
			

			echo 'for(i in 2:(length(flow_frame$time)-1)){' >> flow_acc.R
				
				echo 'dt <- flow_frame[i,"time"]' >> flow_acc.R
				echo 'v_strain <- flow_frame[i,"vstrain_rate"]' >> flow_acc.R
				echo 'h_term <- (flow_frame[i+1,"thick"]-flow_frame[i-1,"thick"])/(2*flow_frame[i,"thick"])' >> flow_acc.R
				echo 'a_dot <- flow_frame[i,"smb_rate"]/('$new_acc_density'/1000)' >> flow_acc.R
				#echo 'a_dot <- 0.41/('$new_acc_density'/1000)' >> flow_acc.R

				# accumulate ice from all the different start points
				echo 'for(layer in 1:8){' >> flow_acc.R
					echo 'if(flow_frame[i,"dist"] > start[layer]){' >> flow_acc.R
					    echo 'z1 <- flow_frame[i-1,13+layer]' >> flow_acc.R
					    # term 1 is upstream input, term 2 is new accumulation. 
					    echo 'term1 <- (z1 * exp(v_strain * dt + h_term))' >> flow_acc.R
					    echo 'term2 <- (a_dot/(v_strain+ h_term/dt)) * (exp(v_strain * dt  + h_term) - 1)' >> flow_acc.R
					    echo 'z2 <- (term1 + term2)' >> flow_acc.R
					    #echo 'print(z2)' >> flow_acc.R
					    
					    # find the mean density of this new thickness and adjust terms 1 and 2
					    # If adjusting for borehole density profile
					    if($density_adjust) then 
						echo 'z2_density<-dens_prof[which.min(abs(dens_prof[,1] - z2)),3]' >> flow_acc.R
						echo 'z2 <- (last_ice_z2_density[layer]/z2_density)*term1 + ('$new_acc_density'/z2_density)*term2' >> flow_acc.R
						echo 'last_ice_z2_density[layer] <- z2_density' >> flow_acc.R
					    endif
					    echo 'flow_frame[i,13+layer] <- z2' >> flow_acc.R
					echo '}' >> flow_acc.R
				echo '}' >> flow_acc.R


				endif
				
			echo '}' >> flow_acc.R
			
			
			echo 'write.table(flow_frame, file="'accum.$start:r:r:t.$scale.$filter.$field.full'",col.names=FALSE,row.names=FALSE)' >> flow_acc.R

			# because these are the layers that get plotted...
			echo 'subvars <- c("thick", "elev", "acc_time", "dist", "tot_smb", "V14", "V15", "V16", "V17", "V18")' >> flow_acc.R
			echo 'write.table(flow_frame[subvars], file="'accum.$start:r:r:t.$scale.$filter.$field.sub'",col.names=FALSE,row.names=FALSE)' >> flow_acc.R

			
			R CMD BATCH flow_acc.R >> flow_acc.R

end